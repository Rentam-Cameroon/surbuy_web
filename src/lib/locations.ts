export interface Town {
    name: string
    region: string
    neighborhoods: string[]
}

export const towns: Town[] = [
    {
        name: "Douala",
        region: "Littoral",
        neighborhoods: [
            "Akwa", "Bonapriso", "Deido", "Bepanda", "Bonamoussadi",
            "Makepe", "Logbessou", "Kotto", "Nylon", "New Bell"
        ]
    },
    {
        name: "Yaoundé",
        region: "Centre",
        neighborhoods: [
            "Bastos", "Centre Administratif (Plateau)", "Tsinga", "Mvog-Mbi",
            "Ekounou", "Mimboman", "Nkolbisson", "Biyem-Assi", "Mendong", "Etoudi"
        ]
    },
    {
        name: "Bamenda",
        region: "Northwest",
        neighborhoods: [
            "Commercial Avenue", "Nkwen", "Foncha Street", "Mulang",
            "Azire", "Atuakom", "Old Town"
        ]
    },
    {
        name: "Buea",
        region: "Southwest",
        neighborhoods: [
            "Buea Town", "Molyko", "Clerks Quarters", "Great Soppo",
            "Bonduma", "Bokwango"
        ]
    },
    {
        name: "Bafoussam",
        region: "West",
        neighborhoods: ["Banengo", "Djeleng", "Famla", "Tyo", "Tougang"]
    },
    {
        name: "Limbé",
        region: "Southwest",
        neighborhoods: ["Limbe Town", "Down Beach", "New Town", "GRA", "Ngeme", "Mabeta"]
    },
    {
        name: "Garoua",
        region: "North",
        neighborhoods: ["Plateau", "Marouaré", "Yelwa", "Djamboutou"]
    },
    {
        name: "Maroua",
        region: "Far North",
        neighborhoods: ["Kakataré", "Doualaré", "Palar", "Djarengol"]
    },
    {
        name: "Kribi",
        region: "South",
        neighborhoods: ["Kribi Town", "Ngoyé", "Toko", "Dombe"]
    },
    {
        name: "Ngaoundéré",
        region: "Adamawa",
        neighborhoods: ["Centre Commercial", "Quartier Haut-Plateau", "Bamyanga"]
    },
    {
        name: "Dschang",
        region: "West",
        neighborhoods: ["Siteu", "Foréké"]
    },
    {
        name: "Nkongsamba",
        region: "Littoral",
        neighborhoods: ["Eboné", "Banékané"]
    },
    {
        name: "Bertoua",
        region: "East",
        neighborhoods: ["Nkolbikon", "Enongal"]
    },
    {
        name: "Kumba",
        region: "Southwest",
        neighborhoods: ["Fiango", "Kumba Town"]
    }
]

export function getCityNames(): string[] {
    return towns.map(t => t.name)
}

export function getNeighborhoodsForCity(cityName: string): string[] {
    const town = towns.find(t => t.name.toLowerCase() === cityName.toLowerCase())
    return town ? town.neighborhoods : []
}
