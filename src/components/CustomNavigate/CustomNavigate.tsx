import { Navigate, NavigateProps, generatePath, useParams } from 'react-router'

export const CustomNavigate = ({ to, ...props }: NavigateProps) => {
  const params = useParams()
  return <Navigate {...props} to={generatePath(to as string, params)} />
}
