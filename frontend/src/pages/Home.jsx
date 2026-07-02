import Navbar from "../components/Navbar/Navbar";
import TalentForm from "../components/TalentForm/TalentForm";
import ResultCard from "../components/ResultCard/ResultCard";
import SkillsChart from "../components/SkillsChart/SkillsChart";
import ImprovementRoadmap from "../components/ImprovementRoadmap/ImprovementRoadmap";
import ProfileComparison from "../components/ProfileComparison/ProfileComparison";

function Home() {
  return (
    <>
      <Navbar />

      <TalentForm />

      <ResultCard />

      <SkillsChart />

      <ImprovementRoadmap />

      <ProfileComparison />
    </>
  );
}

export default Home;