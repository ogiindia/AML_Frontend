const path = require("path");

module.exports = function override(config, env) {


    config.module.rules.forEach((rule) => {
        if (rule.oneOf) {
            rule.oneOf.forEach((oneOf) => {
                if (oneOf.loader && oneOf.loader !== undefined && typeof oneOf.loader === 'string' && oneOf.loader.includes("babel-loader")) {
                    oneOf.include = [
                        path.resolve(__dirname, "src"),
                        path.resolve(__dirname, "../../theme/components/"),
                        path.resolve(__dirname, "../../libs/datatable")
                    ];
                }
            });
        }
    });

    return config;
}