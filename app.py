from flask import Flask, render_template, jsonify
from flask import request
import data as d


app = Flask(__name__)


@app.route('/')
def hello():
    return "hello"

@app.route('/main')
def mainpage():
    return render_template("test.html")

@app.route('/world')
def test():
    return render_template("world.html")


@app.route('/drawmap')
def drawmap():
    return jsonify(d.getLatestCountryStats())

@app.route('/drawmapdate')
def drawmapdate():
    date = request.args.get("date")
    return jsonify(d.getCountryStatsByDate(date))

@app.route('/country', methods=["GET","POST"])
def login_page():
    if request.method == "POST":
        data =  request.get_json()
        c = data['data']
        c1 = d.getCountries()
        count=0
        n=[]
        for i in c:
            if i in c1:
                count+=1
            else:
                n.append(i)

    return jsonify(success=True)

if __name__ == '__main__':
    app.run()