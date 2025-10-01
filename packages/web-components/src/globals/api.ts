import ky from "ky";
import { RibbonData, TableData } from "./models";

async function getJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  return ky.get<T>(url, options).json();
}

export async function getRibbonSummary(
  endpointUrl: string,
  subjectIds: string | string[],
  subset: string,
) {
  const params = new URLSearchParams({
    subset,
  });
  if (typeof subjectIds === "string") {
    subjectIds = subjectIds.split(",");
  }
  subjectIds.forEach((subject) => {
    params.append("subject", subject.trim());
  });

  const url = endpointUrl + "?" + params.toString();
  return await getJson<RibbonData>(url);
}

export async function getTableData(
  endpointUrl: string,
  subjectIds: string | string[],
  slims: string | string[],
  rows: number = -1, // -1 means no limit
) {
  const params = new URLSearchParams({ rows: rows.toString() });
  if (typeof subjectIds === "string") {
    subjectIds = subjectIds.split(",");
  }
  subjectIds.forEach((subject) => {
    params.append("subject", subject.trim());
  });
  if (typeof slims === "string") {
    slims = slims.split(",");
  }
  slims.forEach((slim) => {
    params.append("slim", slim.trim());
  });

  const url = endpointUrl + "?" + params.toString();
  return await getJson<TableData>(url);
}
