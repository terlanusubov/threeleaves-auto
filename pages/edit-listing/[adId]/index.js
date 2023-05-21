import React, {useEffect} from 'react';
import {useRouter} from "next/router";
import Head from "next/head";

export async function getServerSideProps(context) {
    const id = context.query.adId
    return {
        props: {
            listingId: id
        },
        redirect: {
            permanent: false,
            destination: '/edit-listing/' + id + '/features'
        }
    }
}

function Index() {
    return (
        <>
            <Head>
                <title>
                    Treo - Elanı yenilə
                </title>
            </Head>
        </>
    )
        ;
}

export default Index;