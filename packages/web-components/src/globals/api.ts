import { IRibbonModel } from "./models";

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
  return await getJson<IRibbonModel>(url);
}
