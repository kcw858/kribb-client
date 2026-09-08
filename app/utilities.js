const allAvatars = ((ctx) => {
	let keys = ctx.keys();
	return keys.map(ctx);
	// @ts-ignore
})(require.context("./images/avatars", true, /.*/));

export function randomArray(arr) {
	const index = Math.round(Math.random() * (arr.length - 1));
	return arr[index];
}

export function randomAvatar() {
	return randomArray(allAvatars);
}

export function degreeToDirection(degree) {
	if (degree < 11) {
		return "N";
	} else if (degree < 34) {
		return "NNE";
	} else if (degree < 56) {
		return "NE";
	} else if (degree < 79) {
		return "ENE";
	} else if (degree < 101) {
		return "E";
	} else if (degree < 124) {
		return "ESE";
	} else if (degree < 146) {
		return "SE";
	} else if (degree < 169) {
		return "SSE";
	} else if (degree < 191) {
		return "S";
	} else if (degree < 214) {
		return "SSW";
	} else if (degree < 236) {
		return "SW";
	} else if (degree < 259) {
		return "WSW";
	} else if (degree < 281) {
		return "W";
	} else if (degree < 304) {
		return "WNW";
	} else if (degree < 326) {
		return "NW";
	} else if (degree < 348) {
		return "NNW";
	} else {
		return "N";
	}
}

export function directionToDegree(direction) {
	return (
		{
			N: 360,
			NNE: 20,
			NE: 50,
			ENE: 70,
			E: 90,
			ESE: 110,
			SE: 140,
			SSE: 160,
			S: 180,
			SSW: 200,
			SW: 230,
			WSW: 250,
			W: 270,
			WNW: 290,
			NW: 320,
			NNW: 340,
		}[direction] || 0
	);
}
