export type Property = {
  id: number;
  name: string;
  city: string;
  pricePerNight: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePropertyPayload = {
  name: string;
  city: string;
  pricePerNight: number;
  isActive?: boolean;
};
