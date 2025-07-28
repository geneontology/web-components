import { RibbonData, TableData } from "./models";

async function getJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return (await response.json()) as T;
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
