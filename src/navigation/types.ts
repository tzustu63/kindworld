export type RootStackParamList = {
  SignIn: undefined;
  Main: undefined;
  Dashboard: undefined;
  EventFeed: undefined;
  VoucherStore: undefined;
  Profile: undefined;
  MissionDetail: { missionId: string };
  VoucherDetail: { voucherId: string };
  EditProfile: undefined;
  CSRDashboard: { companyId: string };
  AdminMissions: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Activity: undefined;
  Profile: undefined;
};
