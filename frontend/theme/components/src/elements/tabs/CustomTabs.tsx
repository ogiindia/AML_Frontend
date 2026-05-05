import React, { useState } from "react";

type Tab = {
    name: string;
    value: string;
    content: React.ReactNode;
};

type CustomTabsProps = {
    tabs: Tab[];
    defaultValue: string;
};

const CustomTabs: React.FC<CustomTabsProps> = ({ tabs, defaultValue }) => {
    const [activeTab, setActiveTab] = useState<string>(defaultValue);

    const activeContent = tabs.find(t => t.value === activeTab);

    return (
        <div className="tabs-container">

            {/* TAB HEADER */}
            <div className="tabs-header">
                {tabs.map((tab) => (
                    <div
                        key={tab.value}
                        className={`tab-item ${activeTab === tab.value ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.value)}
                    >
                        {tab.name}
                    </div>
                ))}
            </div>

            {/* TAB CONTENT */}
            <div className="tabs-content">
                {activeContent?.content}
            </div>
        </div>
    );
};

export default CustomTabs;