 # -*- coding: utf-8 -*-
from flask import Flask, jsonify
import geoip2.database

app = Flask(__name__)
app.debug = True


@app.before_request
def before_request():
    var = 0


@app.teardown_request
def teardown_request(exception):
    var = 0


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/stats_by_day/', methods = ['GET'])
def stats():
    auth = open('./auth.log')
    value = []
    map_stats = []

    for line in auth:
        month = line.split()[0]
        day = line.split()[1]
        time = line.split()[2]
        user = line.split()[3]
        type = line.split()[4]
        if type.startswith("sshd"):
            asd = line.split()[5] #invalid
            asd1 = line.split()[6] # user

            if asd1.startswith("user"):
                asd2 = line.split()[7] # "username"
                asd3 = line.split()[8] # from or "ip"
                try:
                    ip = line.split()[9]

                except IndexError:
                    ip = line.split()[8]
                    asd2 = "#None#"
                    asd3 = "from"

                location = get_location(ip)
                more_map_stats(location, map_stats)
                data = [month, day, time, asd, asd1, asd2, ip, location]
                value.append(data)

    auth.close()
    return jsonify(data = value, map = map_stats)


def get_location(ip):
    reader = geoip2.database.Reader('./static/GeoLite2-Country.mmdb')
    response = reader.country(ip)
    country = response.country.name
    return country



def more_map_stats(country, map_stats):
    pos = -1
    if [x for x, y in enumerate(map_stats) if y[0] == country]:
        pos = [y[0] for y in map_stats].index(country)

    if (pos != -1):
        map_stats[pos][1] = map_stats[pos][1] + 1
    else:
        map_stats.append([country, 1])
        pos = 1

if __name__ == '__main__':
    app.run()