function List({ data, getTitle, getSubtitle, getLink }) {
  return data.map((el) => `* [${getTitle(el)}](${getLink(el)}) - ${getSubtitle(el)}`).join("\n");
}

function DevtoList(data) {
  return List({
    data,
    getTitle: (e) => e.title,
    getSubtitle: (e) => e.description,
    getLink: (e) => e.url,
  });
}

function ProjectsList(data) {
  return List({
    data,
    getTitle: (e) => e.title,
    getSubtitle: (e) => e.description,
    getLink: (e) => e.url,
  });
}

function MediumList(data) {
  return List({
    data,
    getTitle: (e) => e.title,
    getSubtitle: (e) => e.content.subtitle,
    getLink: (e) => `https://medium.com/@${process.env.MEDIUM_USERNAME}/${e.uniqueSlug}`,
  });
}

function GithubList(data) {
  return List({
    data,
    getTitle: (e) => e.name,
    getSubtitle: (e) => `${e.description} (★${e.stargazers_count}/${e.forks_count})`,
    getLink: (e) => e.html_url,
  });
}

module.exports = { DevtoList, ProjectsList, MediumList, GithubList };
