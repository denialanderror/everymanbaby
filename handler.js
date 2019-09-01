const axios = require("axios");
const https = require("https");
const aws = require("aws-sdk");
const sns = new aws.SNS();
const url = "https://movieeverymanapi.peachdigital.com/movies/13/195";

module.exports.findAndNotify = async () => {
  let response = await axios.get(url);
  const rawListings = response.data.filter(byBabyCinema);
  const listings = JSON.stringify(rawListings.map(friendlyFormat));
  console.log("LISTINGS:" + listings);

  let notification = await sns
    .publish({ TopicArn: process.env.topicArn, Message: listings })
    .promise();

  return listings;
};

const byBabyCinema = film =>
  film.Experiences.map(exp => exp.ExternalId).includes("Baby Club");

const friendlyFormat = ({ Title, Teaser, Sessions }) => {
  console.log(Sessions);
  return {
    title: Title,
    teaser: Teaser,
    times: babySessionsOnly(Sessions)
  };
};

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

const concat = (x, y) => x.concat(y);

const flatMap = (f, xs) => xs.map(f).reduce(concat, []);

Array.prototype.flatMap = function(f) {
  return flatMap(f, this);
};
