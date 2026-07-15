import Hero from "./Hero";
import Counter from "../Home/Counter";
import OurClients from "../Home/OurClients";
import WhoWeAre from "./WhoWeAre";
import  MissionVision from "./MissionVision";
import WhyChooseUs from "./WhyChooseUs"
import CoreValues from "./CoreValues"
import Process from "./Process";
import OurTeam from "./OurTeam";
export default function About() {

    return (

        <>

            <Hero />
            <WhoWeAre />
            <MissionVision />
            <WhyChooseUs />
            <CoreValues />
            {/* <OurTeam /> */}
            <Process />
            <Counter />
            <OurClients />

        </>

    );

}