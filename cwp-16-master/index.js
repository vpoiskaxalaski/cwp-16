//Axios — это кроссбраузерная легковесная JS-библиотека для работы с HTTP-запросами, построенная на Promise API.
const axios = require('axios');
//Bluebird is a fully featured promise library with focus on innovative features and performance
const Promise = require('bluebird');
//Library to provide basic geospatial operations like distance calculation, conversion of decimal coordinates to sexagesimal and vice versa, etc.
const geolib = require('geolib');

(async () => {
	console.log('1. С помощью Geocode.XYZ API отправим параллельные запросы на информацию о городах - Минск, Мадрид, Рим. Из ответов выведем соответствия город - страна');
	(await Promise.all([
		axios.get('https://geocode.xyz/Minsk?json=1'),
		axios.get('https://geocode.xyz/Madrid?json=1'),
		axios.get('https://geocode.xyz/Rome?json=1')
	])).forEach((data) => {
		data = data.data.standard;
		console.log(`${data.city} - ${data.countryname}`);
	});

	console.log('2. С помощью Promise.any получим страну этих городов - Париж, Ницца');
	console.log((await Promise.any([
		axios.get('https://geocode.xyz/Paris?json=1'),
		axios.get('https://geocode.xyz/Nice?json=1')
	])).data.standard.countryname);

	console.log('3. С помощью Geocode.XYZ API отправим параллельные запросы на информацию о городах - Брест и Минск. С помощью geolib вычислим расстояние между ними');
	await Promise.all([
		axios.get('https://geocode.xyz/Brest?json=1&region=BY'),
		axios.get('https://geocode.xyz/Minsk?json=1')
	]).then((data) => {
		console.log(`Result = ${
			geolib.getPathLength([
				{latitude: data[0].data.longt, longitude: data[0].data.latt},
				{latitude: data[1].data.longt, longitude: data[1].data.latt}
			])
			} meters`);
	});

	console.log('4. С помощью Geocode.XYZ API и Promise.mapSeries отправим последовательные запросы на информацию о городах - Минск, Копенгаген, Осло, Брюссель. С помощью geolib.findNearest найдем ближаший к Минску город');
    Promise.mapSeries([
        axios.get('https://geocode.xyz/Minsk?json=1'),
        axios.get('https://geocode.xyz/Copenhagen?json=1'),
        axios.get('https://geocode.xyz/Oslo?json=1'),
        axios.get('https://geocode.xyz/Brussels?json=1')
    ], (a) => { return a; }).then((data) => {
        let arr = [
            {latitude: data[1].data.longt, longitude: data[1].data.latt},
            {latitude: data[2].data.longt, longitude: data[2].data.latt},
            {latitude: data[3].data.longt, longitude: data[3].data.latt}
        ];
        console.log(`Result = ${
            data[
            parseInt(geolib.findNearest(
                {latitude: data[0].data.longt, longitude: data[0].data.latt},
                arr
            ).key) + 1
                ].data.standard.city
            }`);
    });
})();

	/*
	console.log('4. С помощью Geocode.XYZ API и Promise.mapSeries отправим последовательные запросы на информацию о городах - Минск, Копенгаген, Осло, Брюссель. С помощью geolib.findNearest найдем ближаший к Минску город');
	await Promise.mapSeries([
		axios.get('https://geocode.xyz/https://geocode.xyz/?locate=?json=1'),
		axios.get('https://geocode.xyz/Copenhagen?json=1'),
		axios.get('https://geocode.xyz/Oslo?json=1'),
		axios.get('https://geocode.xyz/Brussels?json=1')
	], (a) => { return a; }).then((data) => {
		let arr = [
			{latitude: data[1].data.longt, longitude: data[1].data.latt},
			{latitude: data[2].data.longt, longitude: data[2].data.latt},
			{latitude: data[3].data.longt, longitude: data[3].data.latt}
		];
		console.log(`Result = ${
			data[
			parseInt(geolib.findNearest(
				{latitude: data[0].data.longt, longitude: data[0].data.latt},
				arr
			).key) + 1
				].data.standard.city
			}`);
	});
})();



*/