import pandas as pd
import numpy as np
import json

def getLatestCountryStats():
    country_stats = {}
    df = pd.read_csv('static/covid_19_data.csv')
    countries = df['Country/Region'].unique()

    for country in countries:
        country_cond = df['Country/Region'] == country
        max_date = df[country_cond]['ObservationDate'].max()
        date_cond = df['ObservationDate'] == max_date

        stats={}
        for stat in ['Deaths','Recovered','Confirmed'] :
            stats[stat]=sum(df[country_cond & date_cond][stat])

        # naming consistency of country in dataset and map geojson naming convention
        f = open('static/countries.json', )
        coutry_map = json.load(f)

        if country in coutry_map:
            country_stats[coutry_map[country]] = stats

        else:
            country_stats[country] = stats

    return country_stats

def getCountryStatsByDate(date):
    country_stats = {}
    df = pd.read_csv('static/covid_19_data.csv')
    countries = df['Country/Region'].unique()

    for country in countries:
        country_cond = df['Country/Region'] == country

        date_cond = df['ObservationDate'] == date

        stats = {}
        for stat in ['Deaths', 'Recovered', 'Confirmed']:
            stats[stat] = sum(df[country_cond & date_cond][stat])

        # naming consistency of country in dataset and map geojson naming convention
        f = open('static/countries.json', )
        coutry_map = json.load(f)

        if country in coutry_map:
            country_stats[coutry_map[country]] = stats

        else:
            country_stats[country] = stats

    return country_stats

def getstats_c_date():
    all_stats = {}
    df = pd.read_csv('static/covid_19_data.csv')
    dates = df['ObservationDate'].unique()

    for d in dates:
        all_stats[d] = getCountryStatsByDate(d)

    with open('static/all_stats.json', 'w') as fp:
        json.dump(all_stats, fp)

    return all_stats

def getDaily_all_stats():
    f = open('static/all_stats.json', )
    country_map = json.load(f)
    prev_count = {}
    for date_key in country_map:
        for country_key in country_map[date_key]:
            if country_key in prev_count:
                # confirmed
                curr_c = country_map[date_key][country_key]["Confirmed"]
                country_map[date_key][country_key]["Confirmed"] -= prev_count[country_key]["Confirmed"]
                country_map[date_key][country_key]["Confirmed"] = abs(country_map[date_key][country_key]["Confirmed"])
                prev_count[country_key]["Confirmed"] = curr_c

                # death
                curr_d = country_map[date_key][country_key]["Deaths"]
                country_map[date_key][country_key]["Deaths"] -= prev_count[country_key]["Deaths"]
                country_map[date_key][country_key]["Deaths"] = abs(country_map[date_key][country_key]["Deaths"])
                prev_count[country_key]["Deaths"] = curr_d
                # Recovered
                curr_r = country_map[date_key][country_key]["Recovered"]
                country_map[date_key][country_key]["Recovered"] -= prev_count[country_key]["Recovered"]
                country_map[date_key][country_key]["Recovered"] = abs(country_map[date_key][country_key]["Recovered"])
                prev_count[country_key]["Recovered"] = curr_r

            else:
                curr_c, curr_d, curr_r = country_map[date_key][country_key]["Confirmed"], \
                                         country_map[date_key][country_key]["Deaths"], \
                                         country_map[date_key][country_key]["Recovered"]
                temp_dic = {}
                temp_dic["Confirmed"], temp_dic["Deaths"], temp_dic["Recovered"] = curr_c, curr_d, curr_r
                prev_count[country_key] = temp_dic

    with open('static/all_stats_daily.json', 'w') as fp:
        json.dump(country_map, fp)




    #print(row['Confirmed'], row['Deaths'],row['Recovered'])


'''
def getCountries():
    df = pd.read_csv('static/covid_19_data.csv')
    countries = df['Country/Region'].unique()
    return list(countries)

def checkDate():
    df = pd.read_csv('static/covid_19_data.csv')
    print(df['ObservationDate'][1] == "01/22/2020")

checkDate()
'''

#print(getCountryStatsByDate("01/16/2020"))

#getDaily_all_stats()