import Header from "@/widgets/Header/Header";
import Landing from "@/layouts/Landing/Landing";
import MainSection from "@/widgets/MainSection/MainSection";
import GoalsSection from "@/widgets/GoalsSection/GoalsSection";
import VeteransSection from "@/widgets/VeteransSection/VeteransSection";
import Footer from "@/widgets/Footer/Footer";

export default function Home() {
  return (
      <Landing>
        <Header/>
        <MainSection/>
        <GoalsSection/>
        <VeteransSection/>
        <Footer/>
      </Landing>
  );
}
