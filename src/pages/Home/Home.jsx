import Hero from "./Hero";
import Counter from "./Counter";
import AboutPreview from "./AboutPreview";
import ContactPreview from "./ContactPreview";
// import Test from "./Test";

export default function Home() {

    return (

        <>

            <Hero />
            <Counter/>
            <AboutPreview />
            <ContactPreview />

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