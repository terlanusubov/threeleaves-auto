import useSWR from "swr";
import {API} from "../../core/configs/api.config";

export const useSearchResults = (shouldSearch, value)=>{
    const {data, error} = useSWR(shouldSearch ? API().ads.search : null);
    return {
        searchResult : data?.brands,
        searchLoading : !error && !data,
        searchError : error
    }
}

// export const useFilterCount = ()=>{
//     const {data, error} = useSWR(API.ads.filterCount);
//     return {
//         count : data
//     }
// }