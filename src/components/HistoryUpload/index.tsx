import React, { useState, useEffect, useCallback } from "react";
import { Modal, Upload, Space, Button, Descriptions, Select } from "antd";
import type { UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import Toast from "../Toast";
import Swal from "sweetalert2";
import { TQuestion } from "@/types";

interface IVideoModalProps {
  isModalVisible: boolean;
  handleModalClose: () => void;
  title: string;
  handleSubmit: (fileContents: TQuestion[]) => void;
}

const { Dragger } = Upload;

const HistoryUploadModal: React.FC<IVideoModalProps> = ({
  isModalVisible,
  handleModalClose,
  title,
  handleSubmit,
}) => {
  const [fileContents, setFileContents] = useState<TQuestion[]>([]);
  const [summary, setSummary] = useState({
    qaTxtCount: 0,
    kisTxtCount: 0,
  });
  const [uploadCount, setUploadCount] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false); // added to handle loading state
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(
    null
  );

  // Function to update summary
  const updateSummary = useCallback(() => {
    const qaTxtCount = fileContents.filter((file) => file.type === "qa").length;
    const kisTxtCount = fileContents.filter(
      (file) => file.type === "kis"
    ).length;
    setSummary({ qaTxtCount, kisTxtCount });
  }, [fileContents]);

  // Update summary whenever fileContents changes
  useEffect(() => {
    if (fileContents.length > 0) {
      updateSummary();
    }
  }, [fileContents]);

  useEffect(() => {
    if (uploadCount === 0 && totalFiles === 0) {
      resetUpload();
    }
  }, [uploadCount, totalFiles]);

  // Function to handle file reading
  const handleFileRead = useCallback((file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const content = event.target?.result as string;
          const type = file.name.includes("qa") ? "qa" : "kis";
          const number = parseInt(RegExp(/\d+/).exec(file.name)?.[0] ?? "0", 10);
          setFileContents((prev) => [
            ...prev,
            {
              fileName: file.name,
              type,
              number,
              content,
              history: [],
            },
          ]);
          setUploadCount((prev) => prev + 1);
        }
        resolve();
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }, []);

  // Function to reset the file upload state
  const resetUpload = useCallback(() => {
    setFileContents([]); // Reset fileContents array
    setSummary({ qaTxtCount: 0, kisTxtCount: 0 }); // Reset summary
    setUploadCount(0); // Reset upload count
    setTotalFiles(0); // Reset total files count
    setSelectedFileContent(null); // Reset selected file content
  }, []);

  const props: UploadProps = {
    name: "file",
    multiple: true,
    accept: ".txt",
    showUploadList: false,
    beforeUpload: async (file, fileList) => {
      if (fileContents.length > 0) {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Do you want to delete all files and start over?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete and start over!",
        });
        if (result.isConfirmed) {
          resetUpload();
        } else {
          return false; // Prevent uploading new files
        }
      }
      setTotalFiles(fileList.length); // Set total files to process
      return false; // Prevent default upload action
    },
    onChange: async (info) => {
      const { file } = info;
      if (file instanceof File) {
        try {
          setIsProcessing(true); // Start processing state
          await handleFileRead(file); // Read file contents
          setUploadCount((prev) => prev + 1);
          if (uploadCount + 1 === totalFiles) {
            Toast(`All files uploaded successfully!`, "success", "top-right");
          }
        } catch (error) {
          console.error("Error reading file:", error);
          Toast(`Error reading ${file.name}`, "error", "top-right");
        } finally {
          setIsProcessing(false); // End processing state
        }
      }
    },
  };

  return (
    <>
      <Modal
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={null}
        title="File Preview"
      >
        <Select
          placeholder="Select a file"
          onChange={(value: string) =>
            setSelectedFileContent(
              fileContents.find((file) => file.fileName === value)?.content ||
                ""
            )
          }
          style={{ width: "100%" }}
        >
          {fileContents.map((file) => (
            <Select.Option key={file.fileName} value={file.fileName}>
              {file.fileName}
            </Select.Option>
          ))}
        </Select>
        {selectedFileContent && (
          <Descriptions bordered style={{ marginTop: "1.5rem" }}>
            <Descriptions.Item>{selectedFileContent}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
      <Modal
        open={isModalVisible}
        width="50%"
        title={title}
        onCancel={handleModalClose}
        footer={[
          <Button
            type="dashed"
            key="preview"
            onClick={() => setIsPreviewVisible(true)}
          >
            Preview
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              if (Object.keys(fileContents).length === 0) {
                Toast("Please upload files first", "error", "top-right");
                return;
              }
              handleSubmit(fileContents);
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload of .txt files. The content of
              the files will be read and summarized.
            </p>
          </Dragger>
          {isProcessing && <p>Uploading files, please wait...</p>}
          {summary.qaTxtCount + summary.kisTxtCount > 0 && (
            <Descriptions
              bordered
              title="Upload Summary"
              style={{
                margin: "1rem 0",
              }}
            >
              <Descriptions.Item label="Total QA questions">
                {summary.qaTxtCount}
              </Descriptions.Item>
              <Descriptions.Item label="Total KIS questions">
                {summary.kisTxtCount}
              </Descriptions.Item>
              <Descriptions.Item label="Total questions">
                {summary.qaTxtCount + summary.kisTxtCount}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Space>
      </Modal>
    </>
  );
};

export default HistoryUploadModal;
