import { http } from "@/connections";
import { notify } from "@/utils";
import React, { useState } from "react";

const TempPage: React.FC = () => {
	const [ep, setEp] = useState("");
	const hit = async (endpoint: string) => {
		try {
			const res = await http.get(endpoint);
			notify.info(res.data?.message);
		} catch (error) {
			notify.error(error);
		}
	};
	return (
		<main>
			<button
				onClick={() => {
					hit("http://localhost:4000/api/health");
				}}
			>
				Hit Health API
			</button>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					hit(ep);
				}}
			>
				<input
					type="text"
					name="ep"
					value={ep}
					onChange={(e) => setEp(e.target.value)}
				/>
				<button type="submit">Hit {ep}</button>
			</form>
		</main>
	);
};

export default TempPage;
