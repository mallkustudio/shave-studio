import { getPublicBarbers } from "@/modules/barbers/queries";
import { getSettings, settingsToTransferInfo } from "@/modules/settings/queries";
import { BarberServicePicker } from "./BarberServicePicker";

type Props = {
  searchParams: Promise<{ barberId?: string; serviceId?: string }>;
};

export default async function ReservasPage({ searchParams }: Props) {
  const [barbers, settings, params] = await Promise.all([
    getPublicBarbers(),
    getSettings(),
    searchParams,
  ]);

  const transferInfo = settingsToTransferInfo(settings);

  const rawBarberId = params.barberId;
  const rawServiceId = params.serviceId;

  let initialBarberId: string | null = null;
  let initialServiceId: string | null = null;

  const matchedBarber = barbers.find((b) => b.id === rawBarberId);

  if (matchedBarber) {
    initialBarberId = matchedBarber.id;
    const matchedService = matchedBarber.services.find((s) => s.id === rawServiceId);
    if (matchedService) initialServiceId = matchedService.id;
  } else if (rawServiceId) {
    // No valid barberId — find the first barber that offers this service
    for (const barber of barbers) {
      const matchedService = barber.services.find((s) => s.id === rawServiceId);
      if (matchedService) {
        initialBarberId = barber.id;
        initialServiceId = matchedService.id;
        break;
      }
    }
  }

  return (
    <BarberServicePicker
      barbers={barbers}
      transferInfo={transferInfo}
      initialBarberId={initialBarberId}
      initialServiceId={initialServiceId}
    />
  );
}
