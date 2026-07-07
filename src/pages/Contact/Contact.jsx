import Hero from "./Hero";
import ContactForm from "./ContactForm"
import OurClients from "../Home/OurClients";
import OurTeam from "../About/OurTeam";
export default function Contact(){
     return (
    
            <>
    
                <Hero />
                <ContactForm />
                <OurTeam />
                <OurClients />
                {/*
                    Next Sections
    
                    <ProductPreview />
                    <WhyChooseUs />
                    <Clients />
                    <Test /> 
                */}
    
            </>
    
        );
}