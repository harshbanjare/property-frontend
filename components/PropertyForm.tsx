import { useForm } from "react-hook-form";
import type { CreatePropertyPayload, Property } from "@/types/properties";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { createProperty } from "@/lib/propertyApi";

type PropertyFormParam = {
  setProperties: Dispatch<SetStateAction<Property[]>>;
};

const PropertyForm = ({ setProperties }: PropertyFormParam) => {
  let [successMessage, setSuccessMessage] = useState<string>("");
  let [error, setError] = useState<string>("");

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

  const onSubmit = async (data: CreatePropertyPayload) => {
    setError("");
    try {
      const createdProperty = await createProperty(data);
      setProperties((prevProperties: Property[]) => [
        createdProperty,
        ...prevProperties,
      ]);
      setSuccessMessage("Property Created Successfully");
      reset({
        name: "",
        city: "",
        pricePerNight: 0,
        isActive: true,
      });
    } catch (err) {
      setError("Failed To create Property");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 w-full">
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
          <p className="text-sm text-red-500">{errors.pricePerNight.message}</p>
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
      {successMessage && (
        <div className="mt-2 rounded bg-gray-100 px-3 py-2 text-green-600">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mt-2 rounded bg-gray-100 px-3 py-2 text-red-500">
          {error}
        </div>
      )}
    </form>
  );
};

export default PropertyForm;
