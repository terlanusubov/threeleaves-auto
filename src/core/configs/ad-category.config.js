import {domainsConfig} from "./domains.config";
import {dom} from "@fortawesome/fontawesome-svg-core";

const adCategoryConfig = {
    10: {
        id: 'auto',
        name: 'Avtomobil',
        agency: 'Avtosalon',
        url: domainsConfig["10"] + '/publish'
    },
    20: {
        id: 'property',
        name: 'Daşınmaz əmlak',
        agency: 'Agentlik',
        url: domainsConfig["20"] + '/publish'
    },
    30: {
        id: 'stuff',
        name: 'Əşya',
        agency: 'Mağaza',
        url: domainsConfig["30"] + '/publish'
    },
}

export default adCategoryConfig;
