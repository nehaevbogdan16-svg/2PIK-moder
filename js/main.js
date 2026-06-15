const news = [

    {

        title: "Открытие официального сайта",

        date: "15.06.2026"

    },

    {

        title: "Набор новых участников",

        date: "15.06.2026"

    }

];

const container =

    document.getElementById(

        "news-container"

    );

news.forEach(item => {

    const div =

        document.createElement("div");

    div.className =

        "news-item";

    div.innerHTML = `

        <h3>${item.title}</h3>

        <p>${item.date}</p>

    `;

    container.appendChild(div);

});
