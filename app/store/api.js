import axios from "axios";
import config from "../../config";

class Api {
	token = "";
	remoteToken = () => {};

	setToken(token, remoteToken) {
		this.token = token;
		this.remoteToken = () => {
			this.token = "";
			remoteToken();
		};
	}

	async postSilently(path, params) {
		return await this.post(path, params, true);
	}

	async post(path, params, isSilently) {
		let response = await axios.post(`${path}`, params, {
			baseURL: config.apiHost,
			validateStatus: () => true,
			timeout: 0,
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
		});

		if (!isSilently && response.status != 200) {
			if (response.data.result) {
				alert(response.data.result);
			} else if (response.data.title) {
				alert(response.data.title);
			} else {
				alert(`요청에 실패하였습니다. 에러코드: ${response.status}`);
			}

			if (response.status == 401) {
				this.remoteToken();
			}
		}

		return response;
	}
}

export default new Api();
