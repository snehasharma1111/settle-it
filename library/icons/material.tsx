import React from "react";

type MaterialIconName = { icon: string };

type MaterialIconProps = React.HTMLAttributes<HTMLSpanElement> &
	MaterialIconName;

export const MaterialIcon: React.FC<MaterialIconProps> = ({
	icon,
	...rest
}) => (
	<span className="material-symbols-outlined" {...rest}>
		{icon}
	</span>
);
