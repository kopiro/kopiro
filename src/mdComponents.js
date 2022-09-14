const List = ({ data, getTitle, getSubtitle, getLink }) =>
  data.map((el) => `* [${getTitle(el)}](${getLink(el)}) ${getSubtitle(el)}`).join("\n");

const DevtoList = (data) =>
  List({
    data,
    getTitle: (e) => e.title,
    getSubtitle: (e) => e.readable_publish_date,
    getLink: (e) => e.url,
  });

const ProjectsList = (data) =>
  List({
    data,
    getTitle: (e) => e.title,
    getSubtitle: (e) => e.year,
    getLink: (e) => e.url,
  });

const GithubList = (data) =>
  List({
    data,
    getTitle: (e) => e.name,
    getSubtitle: (e) => e.description,
    getLink: (e) => e.html_url,
  });

module.exports = { DevtoList, ProjectsList, GithubList };
