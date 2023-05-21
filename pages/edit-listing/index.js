import React, {useEffect, useState} from 'react';
import PriceCard from "../../src/core/shared/price-card";
import PublishLayout from "../../src/core/layouts/publish";
import {useRouter} from "next/router";
import Head from "next/head";

export async function getServerSideProps(context) {
    return {
        props: {},
        redirect: {
            permanent: false,
            destination: '/'
        }
    }
}

function EditListing(props) {
    const router = useRouter()

    return (
        <>
            <Head>
                <title>
                    Treo - Elanı dəyiş
                </title>
            </Head>
        </>
    )
        ;
}

export default EditListing;