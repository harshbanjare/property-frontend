"use client";
import { PorpertyList } from "@/components/PropertyList";
import { createProperty, getAllProperty } from "@/lib/propertyApi";
import { CreatePropertyPayload, Property } from "@/types/properties";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
  let [properties, setProperties] = useState<Property[]>([]);
  let [propertiesloading, setPropertiesLoading] = useState<boolean>(true);
  let [propertiesError, propertiesSetError] = useState<string>("");
  let [searchTerm, setSearchTerm] = useState<string>("");
  let [debouncedSearchTerm, setDobouncedSearchTerm] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePropertyPayload>({
    defaultValues: {
      name: "",
      city: "",
      pricePerNight: 0,
      isActive: true,
    },
  });

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

  const onSubmit = async (data: CreatePropertyPayload) => {
    propertiesSetError("");
    try {
      const createdProperty = await createProperty(data);
      setProperties((prevProperties) => [createdProperty, ...prevProperties]);
      reset({
        name: "",
        city: "",
        pricePerNight: 0,
        isActive: true,
      });
    } catch (err) {
      propertiesSetError("Failed To create Property");
    }
  };
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-4 w-full"
        >
          <div>
            <label className="block mb-1 font-medium">Property Name</label>
            <input
              type="text"
              {...register("name", {
                required: "Property name is required",
              })}
              className="w-full rounded border px-3 py-2"
              placeholder="Enter property name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">City</label>
            <input
              type="text"
              {...register("city", {
                required: "City is required",
              })}
              className="w-full rounded border px-3 py-2"
              placeholder="Enter city"
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Price Per Night</label>
            <input
              type="number"
              {...register("pricePerNight", {
                required: "Price is required",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Price must be at least 1",
                },
                validate: (value) =>
                  Number.isInteger(Number(value)) ||
                  "Must be a whole number (no decimals)",
              })}
              className="w-full rounded border px-3 py-2"
              placeholder="Enter price per night"
            />
            {errors.pricePerNight && (
              <p className="text-sm text-red-500">
                {errors.pricePerNight.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("isActive")} id="isActive" />
            <label htmlFor="isActive" className="font-medium">
              Active
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Property"}
          </button>
        </form>
      </div>
    </div>
  );
}
