import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from "../button";
import React from "react";
import {useRouter} from "next/router";
function PublishGoBack({className = ''}) {
    const router = useRouter()
    const click = ()=>{
        router.back()
    }
    return (
        <Button click={click} color='dark' classes={'w-100 '+ className} inverted>
            <FontAwesomeIcon icon={'chevron-left'}/>
            Geriyə
        </Button>
    );
}

export default PublishGoBack;
