import Hero from "./Hero";
import Counter from "./Counter";
import AboutPreview from "./AboutPreview";
import ContactPreview from "./ContactPreview";
import OurClients from "./OurClients";
import ProductPreview from "./ProductPreview";
// import Test from "./Test";

export default function Home() {

    return (

        <>

            <Hero />
           
            <ProductPreview />
            <AboutPreview />
            <ContactPreview />
             <Counter/>
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