import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const userInfoState = atom({
  key: "userInfoState",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

const isLoggedInState = atom({
  key: "isLoggedInState",
  default: false,
});

export { isLoggedInState, userInfoState };

