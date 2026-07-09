import { useState } from "react";
import ServiceList from "./ServiceList";
import ServiceCategories from "./ServiceCategories";
import ServiceOffers from "./ServiceOffers";

export default function Services() {

    const [step, setStep] = useState("services"); // "services" | "categories" | "offers"
    const [selectedService, setSelectedService] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleSelectService = (service) => {
        setSelectedService(service);
        setStep("categories");
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setStep("offers");
    };

    const handleBackToServices = () => {
        setSelectedCategory(null);
        setStep("services");
    };

    const handleBackToCategories = () => {
        setSelectedCategory(null);
        setStep("categories");
    };

    return (
        <>
            {step === "services" && (
                <ServiceList onSelect={handleSelectService} />
            )}

            {step === "categories" && (
                <ServiceCategories
                    service={selectedService}
                    onSelect={handleSelectCategory}
                    onBack={handleBackToServices}
                />
            )}

            {step === "offers" && (
                <ServiceOffers
                    category={selectedCategory}
                    onBack={handleBackToCategories}
                />
            )}
        </>
    );
}