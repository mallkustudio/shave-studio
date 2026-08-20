import { BarbersHero } from "@/components/web/barbers/BarbersHero";
import { TheTeam } from "@/components/web/barbers/TheTeam";
import { getPublicBarbers } from "@/modules/barbers/queries";

export default async function BarbersPage() {
  const barbers = await getPublicBarbers();
  return (
    <main>
      <BarbersHero />
      <TheTeam barbers={barbers} />
    </main>
  );
}
