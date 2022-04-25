import * as yup from "yup";

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

export const defaultValues = {
  kpi_id: null,
  client_id: null,
  title: null,
  description: null,
  winnerPoints: null,
  start_date: today,
  end_date: tomorrow,
  challengesUser: null,
  teams: null,
  cstatus: true,
};

export const registerValidationSchema = yup.object().shape(
  {
    kpi_id: yup.string().required("Kpi is Required").nullable(),
    client_id: yup.string().required("Client ID Field is Required"),
    title: yup.string().required("Name is Required").nullable(),
    description: yup.string().required("Description is Required").nullable(),
    winnerPoints: yup.string().required("Coins is Required").nullable(),
    start_date: yup
      .date()
      .required("Start Date is Required")
      .default(() => new Date())
      .min(new Date(), "Start date should not be in the past."),
    end_date: yup
      .date()
      .required("End Date is Required")
      .min(
        yup.ref("start_date"),
        "End date can't be before or equal start date"
      ),
    challengesUser: yup
      .array()
      .when("teams", {
        is: null,
        then: yup.array().required("Must select an agent or a team").nullable(),
      })
      .nullable(),
    teams: yup
      .array()
      .when("challengesUser", {
        is: null,
        then: yup.array().required("Must select a team or an agent").nullable(),
      })
      .nullable(),
    schedule: yup.string().required("Schedule is Required"),
  },
  [["challengesUser", "teams"]]
);

export const editValidationSchema = yup.object().shape(
  {
    title: yup.string().required("Name is Required").nullable(),
    description: yup.string().required("Description is Required").nullable(),
    winnerPoints: yup.string().required("Coins is Required").nullable(),
    end_date: yup
      .date()
      .required("End Date is Required")
      .min(
        yup.ref("start_date"),
        "End date can't be before or equal start date"
      ),
    challengesUser: yup
      .array()
      .when("teams", {
        is: null,
        then: yup
          .array()
          .required("Must select an agent or a department")
          .nullable(),
      })
      .nullable(),
    teams: yup
      .array()
      .when("challengesUser", {
        is: null,
        then: yup
          .array()
          .required("Must select a department or an agent")
          .nullable(),
      })
      .nullable(),
    schedule: yup.string().required("Schedule is Required"),
  },
  [["challengesUser", "teams"]]
);
