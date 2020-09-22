const List = ({ data, getTitle, getSubtitle, getLink }) =>
  data.map((el) => `* [${getTitle(el)}](${getLink(el)}) ${getSubtitle(el)}`).join("\n");

const StdList = (data) =>
  List({
    data,
    getTitle: (e) => e.title,
    getSubtitle: (e) => e.description,
    getLink: (e) => e.url,
  });

const DevtoList = StdList;
const ProjectsList = StdList;

const GithubList = (data) =>
  List({
    data,
    getTitle: (e) => e.name,
    getSubtitle: (e) => `${e.description} (★${e.stargazers_count}/${e.forks_count})`,
    getLink: (e) => e.html_url,
  });

module.exports = { DevtoList, ProjectsList, GithubList };
