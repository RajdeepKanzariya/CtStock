import Hero from "./Hero";
import Counter from "../Home/Counter";
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
            <Counter />
            <WhoWeAre />
            <MissionVision />
            <WhyChooseUs />
            <CoreValues />
            <OurTeam />
            <Process />
            
            {/*
                Next Sections

                <ProductPreview />
                
                <Clients />
                <Test /> 
            */}

        </>

    );

}