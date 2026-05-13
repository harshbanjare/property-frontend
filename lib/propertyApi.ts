import { CreatePropertyPayload, Property } from "@/types/properties";
import { apiClient } from "./api";

export async function getAllProperty(search: string): Promise<Property[]> {
  let properties = await apiClient.get<Property[]>(
    `/properties?search=${search}`,
  );
  return properties.data;
}

export async function createProperty(
  createPropertyPayload: CreatePropertyPayload,
): Promise<Property> {
  let property = await apiClient.post<Property>(
    "/properties",
    createPropertyPayload,
  );

  return property.data;
}
