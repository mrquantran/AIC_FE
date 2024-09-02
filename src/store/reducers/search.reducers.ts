// src/store/reducers/search.reducer.ts
import * as actions from "../actions/search.actions";
import update from "immutability-helper";
import { ActionType, getType } from "typesafe-actions";
import { TModelSearch } from "@/types/apis/search";

export type TSearch = {
  tabKey: number;
  model: TModelSearch;
  value: string | string[];
};

export type TSearchState = {
  searchResult: {
    data: any;
    total: number;
  };
  temporalSearchResult: {
    data: any;
    total: number;
  };
  temporalSearch: string[];
  search: TSearch[];
  disabledTabs: number[];
};

const trySearchState = [
  "The video shows three Samsung phones at the product launch. Initially, each phone appears one by one, and then all three phones appear together.",
  "The image shows a close-up of two people exchanging documents or possibly a device, such as a tablet. Both individuals appear to be wearing work uniforms. One of them is wearing a high-visibility vest with reflective stripes, and you can see part of a logo or text on the vest that reads 'TA EG.' The scene likely takes place at a construction site or similar work environment, as suggested by the attire and the background. The image also has a news channel logo in the upper right corner ('HTV7 HD') with a timestamp, and there is a news ticker at the bottom with Vietnamese text. The ticker mentions something about revenue increases for state-owned enterprises using state capital.",
  'The image shows a nighttime scene of what appears to be an explosion or fireworks in a city. The explosion is creating a bright orange burst of light, illuminating the surrounding area. The buildings in the foreground are dark silhouettes against the night sky. This event seems to be captured from a distance, with the dark cityscape and the bright explosion creating a stark contrast. The image also features a news channel logo ("HTV7 HD") in the upper right corner with a timestamp. The news ticker at the bottom, in Vietnamese, mentions that the President of Egypt, Abdel-Fattah El-Sisi, has officially submitted his candidacy for a third term.',
  'The image depicts a cityscape under a clear blue sky. Several buildings are visible in the foreground, with a mix of residential and commercial structures. The skyline includes a few taller buildings, and the sea can be faintly seen in the distance, suggesting that this might be a coastal city. A faint trail of smoke or vapor can be seen in the sky, likely indicating the path of a missile or a rocket, as it ascends. The event is taking place during daylight, under bright, clear conditions. The image also features a news channel logo ("HTV7 HD") in the upper right corner with a timestamp. The news ticker at the bottom, in Vietnamese, mentions priorities related to adapting to climate change and references international financial institutions like the International Monetary Fund (IMF) and the World Bank.',
  'The image shows a digital departure board at an airport, displaying flight information in both English and Chinese. The board lists flights, airlines, and destinations along with the corresponding boarding gates and statuses. The times listed are in 24-hour format, and some flights have been marked as canceled or have other status updates. The background includes a mix of blue and black colors, with different sections highlighting various details like flight numbers, destinations, and times. The image also includes the "HTV7 HD" news channel logo in the upper right corner with a timestamp. The news ticker at the bottom, in Vietnamese, mentions that Japan has issued tsunami warnings for the Izu and Ogasawara Islands.',
  'The image shows the interior of an airport terminal, with passengers gathered around a large digital departure board. The terminal is spacious and well-lit, with a high ceiling featuring a geometric design. Passengers are seen pushing luggage carts and looking up at the departure board, which displays flight information. The area is marked with large letters indicating sections of the terminal, such as "H," "G," "F," and "E," hanging from the ceiling. The image includes the "HTV7 HD" news channel logo in the upper right corner with a timestamp. The news ticker at the bottom, in Vietnamese, mentions that over 100,000 people have been displaced due to flooding, and there is also a mention of schools in Hong Kong being closed due to heavy rain.',
  'The image shows a scene of wet pavement, likely after a heavy rainstorm. An overturned and damaged umbrella lies on the ground, indicating strong winds. The pavement is shiny and reflective due to the rain, and in the background, there are some structures, possibly part of a parking lot or a construction area, with yellow and black striped markings on a curb. The "HTV7 HD" news channel logo is visible in the upper right corner, along with a timestamp. The news ticker at the bottom of the image, in Vietnamese, mentions that a weather system moving westward is weakening into a tropical depression, and cold air is affecting the northern region',
  'The image shows a waterfront at night during stormy weather. The waves appear rough, crashing against the shoreline, which is illuminated by streetlights that line the waterfront. Buildings in the background are faintly visible, with their windows lit up. The overall scene is dark, but the lights from the streetlamps and the buildings create a glowing effect. The water appears to be agitated, possibly due to strong winds or heavy rainfall. The "HTV7 HD" logo is present in the upper right corner with a timestamp. The news ticker at the bottom, in Vietnamese, mentions ongoing floods causing significant damage in various localities.',
  ' The image is of a news anchor presenting on television. The anchor is standing against a background that has a gradient of warm colors, possibly depicting a sunset or dawn. The anchor is dressed professionally in a white shirt and blue skirt, holding a notepad or document folder. To the right of the anchor, there is an inset image showing a traditional cultural event with people dressed in elaborate costumes, likely performing or participating in a festival. The "HTV7 HD" logo is also present in the upper right corner with a timestamp. The news ticker at the bottom, in Vietnamese, mentions that heavy rains have caused deep flooding in Kon Tum city and that rescue operations have been successfully conducted.',
  'The image captures a dashboard view from inside a moving vehicle on a highway. The road is winding, with a few vehicles ahead, including a truck and a car. The highway is surrounded by greenery, with trees and hills in the background under a partly cloudy sky. The image also has an overlay that appears to be an artistic reflection or a visual effect showing the face of a decorative sculpture or mask, possibly a cultural or religious artifact, superimposed over the windshield view. The "HTV7 HD" logo and timestamp are present in the upper right corner. The news ticker at the bottom, in Vietnamese, discusses the ongoing conflict in Ukraine, mentioning Ukrainian forces moving toward Krasny Liman and a call from President Volodymyr Zelensky.',
  'The second image shows a close-up of a damaged vehicle, specifically focusing on the front wheel and the area around it. The car has significant damage, with the bodywork around the wheel being crumpled and torn. The tire appears intact, but the surrounding structure is severely dented and damaged, likely from a collision. The "HTV7 HD" logo is visible in the upper right corner along with a timestamp. The news ticker at the bottom mentions intelligence reports from Ukraine acknowledging a failure in an effort to capture the Zaporizhzhia nuclear power plant.',
  'The third image shows a courtroom scene with several people seated in the audience, including some in police uniforms, likely law enforcement officers. The setting is a formal courtroom, with a mix of uniformed officers and civilians in attendance. The individuals are seated in rows, with some wearing face masks, indicating adherence to health precautions. The courtroom features large windows and wall-mounted fans. The "HTV7 HD" logo is also present with a timestamp. The news ticker at the bottom mentions a call from the World Food Programme to open a humanitarian corridor to support the people of Palestine.',
  'The fourth image captures a group of parachutists descending from the sky. The parachutes are colorful, with each parachutist having a different colored canopy. They are high in the sky, with a backdrop of clouds and a clear blue sky. The scene appears to be part of a coordinated parachuting event, possibly a military exercise or a sporting event. The image is taken from a perspective looking up at the parachutists as they descend. The "HTV7 HD" logo is visible in the upper right corner with a timestamp. The image focuses solely on the parachutists and the sky.',
  'The image shows a chaotic scene in Japan with downed power lines and damaged infrastructure, indicating severe weather conditions that have complicated rescue operations. The area appears to be heavily affected, with poles and wires scattered across the street, creating a dangerous environment. The "HTV7 HD" logo and a news ticker in Vietnamese report that bad weather in Japan is hampering rescue efforts.',
  'The image captures a vibrant scene at an event in Ho Chi Minh City where over 35,000 students are participating in the 2024 Spring Volunteer campaign. The event is lively, with students waving colorful flags on a stage set against a brightly lit backdrop. The "HTV7 HD" logo is visible in the corner, and the news ticker highlights the large turnout for this community service initiative.',
  'The image shows a close-up of a large crowd of students, all wearing yellow shirts with red collars, who are part of the same volunteer campaign in Ho Chi Minh City. The students are clapping, smiling, and some are taking photos, capturing the festive and energetic atmosphere of the event. The "HTV7 HD" logo and timestamp are present, indicating ongoing coverage of the event.',
];

const defaultSearchState: TSearch[] = [
  {
    tabKey: 1,
    model: "Text",
    value: "",
  },
];

export const getInitialSearchState = () => {
  return {
    temporalSearch: [],
    temporalSearchResult: {
      data: [],
      total: 0,
    },
    searchResult: {
      data: [],
      total: 0,
    },
    search: defaultSearchState,
    disabledTabs: [],
  };
};

export type TSearchActionType = ActionType<typeof actions>;

export default (
  state: TSearchState = getInitialSearchState(),
  action: TSearchActionType
): TSearchState => {
  switch (action.type) {
    case getType(actions.setSearchTerm): {
      const index = state.search.findIndex(
        (s) => s.tabKey === action.payload.tabKey
      );
      if (index === -1) {
        // If the search item doesn't exist, create a new one
        return update(state, {
          search: {
            $push: [
              {
                tabKey: action.payload.tabKey,
                model: action.payload.model,
                value: action.payload.value,
              },
            ],
          },
        });
      } else {
        // If the search item exists, update its value
        return update(state, {
          search: {
            [index]: {
              model: { $set: action.payload.model },
              value: { $set: action.payload.value },
            },
          },
        });
      }
    }
    case getType(actions.setDisabledTabs):
      const uniqueDisabledTabs = Array.from(new Set(action.payload));
      return update(state, {
        disabledTabs: {
          $set: uniqueDisabledTabs,
        },
      });
    case getType(actions.setEnabledTabs):
      // payload is array number
      const uniqueEnabledTabs = Array.from(new Set(action.payload));
      return update(state, {
        disabledTabs: {
          $set: state.disabledTabs.filter(
            (item) => !uniqueEnabledTabs.includes(item)
          ),
        },
      });
    case getType(actions.setTemporalSearchResult):
      return update(state, {
        temporalSearchResult: {
          data: { $set: action.payload.data },
          total: { $set: action.payload.total },
        },
      });
    case getType(actions.setClearTemporalSearch):
      return update(state, {
        temporalSearch: {
          $set: [],
        },
      });
    case getType(actions.setSelectedTemporalQuery):
      const prevTemporalSearch = state.temporalSearch;
      if (prevTemporalSearch.includes(action.payload)) {
        return update(state, {
          temporalSearch: {
            $set: prevTemporalSearch.filter((item) => item !== action.payload),
          },
        });
      } else {
        return update(state, {
          temporalSearch: {
            $push: [action.payload],
          },
        });
      }
    case getType(actions.clearSearchQuery):
      return getInitialSearchState();
    case getType(actions.setSearchResult):
      return update(state, {
        searchResult: {
          data: { $set: action.payload.data },
          total: { $set: action.payload.total },
        },
      });
    case getType(actions.trySearchQuery):
      // get random element in trySearchState array
      const randomElement =
        trySearchState[Math.floor(Math.random() * trySearchState.length)];

      return update(state, {
        search: {
          0: {
            value: { $set: randomElement },
          },
        },
      });
    case getType(actions.setRemoveQuery):
      return update(state, {
        search: {
          $apply: (searchArray: TSearch[]) =>
            searchArray.filter((item) => item.tabKey !== action.payload),
        },
      });
    case getType(actions.setRemoveQueryValue):
      return update(state, {
        search: {
          $apply: (searchArray: TSearch[]) =>
            searchArray.map((item) => {
              if (item.tabKey === action.payload) {
                return { ...item, value: "" };
              } else {
                return item;
              }
            }),
        },
      });
    default:
      return state;
  }
};
