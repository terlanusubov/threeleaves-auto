import sedan from '../../assets/images/car-body/sedan.svg'
import suv from '../../assets/images/car-body/suv.svg'
import crossover from '../../assets/images/car-body/crossover.svg'
import cabriolet from '../../assets/images/car-body/cabriolet.svg'
import coupe from '../../assets/images/car-body/coupe.svg'
import roadster from '../../assets/images/car-body/roadster.svg'
import hatchback from '../../assets/images/car-body/hatchback.svg'
import bus from '../../assets/images/car-body/bus.svg'
import minibus from '../../assets/images/car-body/minibus.svg'
import caravan from '../../assets/images/car-body/caravan.svg'
import universal from '../../assets/images/car-body/universal.svg'
import van from '../../assets/images/car-body/van.svg'
import minivan from '../../assets/images/car-body/minivan.svg'
import pickup from '../../assets/images/car-body/pickup.svg'
import motorbike from '../../assets/images/car-body/motorbike.svg'
import atv from '../../assets/images/car-body/atv.svg'
import limo from '../../assets/images/car-body/limo.svg'
import golfcart from '../../assets/images/car-body/golfcart.svg'
import truck from '../../assets/images/car-body/truck.svg'

import sedanActive from '../../assets/images/car-body/sedan-active.svg'
import suvActive from '../../assets/images/car-body/suv-active.svg'
import crossoverActive from '../../assets/images/car-body/crossover-active.svg'
import cabrioletActive from '../../assets/images/car-body/cabriolet-active.svg'
import coupeActive from '../../assets/images/car-body/coupe-active.svg'
import roadsterActive from '../../assets/images/car-body/roadster-active.svg'
import hatchbackActive from '../../assets/images/car-body/hatchback-active.svg'
import busActive from '../../assets/images/car-body/bus-active.svg'
import minibusActive from '../../assets/images/car-body/minibus-active.svg'
import caravanActive from '../../assets/images/car-body/caravan-active.svg'
import universalActive from '../../assets/images/car-body/universal-active.svg'
import vanActive from '../../assets/images/car-body/van-active.svg'
import minivanActive from '../../assets/images/car-body/minivan-active.svg'
import pickupActive from '../../assets/images/car-body/pickup-active.svg'
import motorbikeActive from '../../assets/images/car-body/motorbike-active.svg'
import atvActive from '../../assets/images/car-body/atv-active.svg'
import limoActive from '../../assets/images/car-body/limo-active.svg'
import golfcartActive from '../../assets/images/car-body/golfcart-active.svg'
import truckActive from '../../assets/images/car-body/truck-active.svg'

const carBodies = {
    sedan : {
        nameAZ : 'Sedan',
        icon : sedan,
        activeIcon : sedanActive,

    },
    suv : {
        nameAZ : 'SUV',
        icon : suv,
        activeIcon : suvActive,
    },
    crossover : {
        nameAZ : 'Crossover',
        icon : crossover,
        activeIcon : crossoverActive,
    },
    cabriolet : {
        nameAZ : 'Kabrio',
        icon : cabriolet,
        activeIcon : cabrioletActive,
    },
    coupe : {
        nameAZ : 'Kupe',
        icon : coupe,
        activeIcon : coupeActive,
    },
    roadster : {
        nameAZ : 'Rodster',
        icon : roadster,
        activeIcon : roadsterActive,
    },
    hatchback : {
        nameAZ : 'Heçbek/Liftbek',
        icon : hatchback,
        activeIcon : hatchbackActive,

    },
    bus : {
        nameAZ : 'Avtobus',
        icon : bus,
        activeIcon : busActive,
    },
    minibus : {
        nameAZ : 'Mikroavtobus',
        icon : minibus,
        activeIcon : minibusActive,

    },
    caravan : {
        nameAZ : 'Karavan',
        icon : caravan,
        activeIcon : caravanActive,

    },
    universal : {
        nameAZ : 'Universal',
        icon : universal,
        activeIcon : universalActive,

    },
    van : {
        nameAZ : 'Van',
        icon : van,
        activeIcon : vanActive,

    },
    minivan : {
        nameAZ : 'Minivan',
        icon : minivan,
        activeIcon : minivanActive,

    },
    pickup : {
        nameAZ : 'Pikap',
        icon : pickup,
        activeIcon : pickupActive,

    },
    motorbike : {
        nameAZ : 'Motosiklet',
        icon : motorbike,
        activeIcon : motorbikeActive,

    },
    atv : {
        nameAZ : 'Kvadrasikl',
        icon : atv,
        activeIcon : atvActive,

    },
    limo : {
        nameAZ : 'Limuzin',
        icon : limo,
        activeIcon : limoActive,

    },
    golfcart : {
        nameAZ : 'Qolfkart',
        icon : golfcart,
        activeIcon : golfcartActive,

    },
    truck : {
        nameAZ : 'Yük maşını',
        icon : truck,
        activeIcon : truckActive,
    }
}

export const carBodyConfig = (name) =>{
    return carBodies[name] || null
}