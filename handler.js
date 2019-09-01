const axios = require("axios");
const https = require("https");
const aws = require("aws-sdk");
const sns = new aws.SNS();
const url = "https://movieeverymanapi.peachdigital.com/movies/13/195";

module.exports.findAndNotify = async () => {
  return axios
    .get("https://movieeverymanapi.peachdigital.com/movies/13/195")
    .then(({ data }) => {
      const listings = data.filter(byBabyCinema).map(friendlyFormat);
      console.log("LISTINGS:" + JSON.stringify(listings));
      sns
        .publish({ TopicArn: process.env.topicArn, message: listings })
        .promise()
        .then(() => console.log("message published"))
        .catch(error => console.log("SNS ERROR:" + error));
      return listings;
    })
    .catch(error => console.log("API ERROR:" + error));
};

const byBabyCinema = film =>
  film.Experiences.map(exp => exp.ExternalId).includes("Baby Club");

const friendlyFormat = ({ Title, Teaser, Sessions }) => ({
  title: Title,
  teaser: Teaser,
  times: babySessionsOnly(Sessions)
});

const babySessionsOnly = sessions =>
  sessions
    .flatMap(session =>
      session.Times.map(time => ({ date: session.Date, time }))
    )
    .filter(event =>
      event.time.Experience.map(experience => experience.ExternalId).includes(
        "Baby Club"
      )
    )
    .map(event => ({ date: event.date, time: event.time.StartTime }));
