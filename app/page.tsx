"use client";
import PropertyForm from "@/components/PropertyForm";
import { PorpertyList } from "@/components/PropertyList";
import { createProperty, getAllProperty } from "@/lib/propertyApi";
import { CreatePropertyPayload, Property } from "@/types/properties";
import { useState, useEffect } from "react";

export default function Home() {
  let [properties, setProperties] = useState<Property[]>([]);
  let [propertiesloading, setPropertiesLoading] = useState<boolean>(true);
  let [propertiesError, propertiesSetError] = useState<string>("");
  let [searchTerm, setSearchTerm] = useState<string>("");
  let [debouncedSearchTerm, setDobouncedSearchTerm] = useState<string>("");

  useEffect(() => {
    let timeout = setTimeout(() => setDobouncedSearchTerm(searchTerm), 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchTerm]);

  useEffect(() => {
    async function getProperties() {
      setPropertiesLoading(true);
      propertiesSetError("");
      try {
        let properties = await getAllProperty(debouncedSearchTerm);
        setProperties(properties);
      } catch (err) {
        propertiesSetError("Something Went Wrong!");
      } finally {
        setPropertiesLoading(false);
      }
    }

    getProperties();
  }, [debouncedSearchTerm]);

  return (
    <div className="flex bg-gray-100 flex-row p-4 gap-2">
      <PorpertyList
        properties={properties}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        loading={propertiesloading}
        error={propertiesError}
      />

      <div className="flex flex-col min-w-[550px] bg-gray-200 rounded-sm p-4">
        <h1 className="text-center justify-center text-3xl">
          {" "}
          Create Property
        </h1>

        <PropertyForm setProperties={setProperties} />
      </div>
    </div>
  );
}
