import Tag from 'antd/es/tag';

const CustomTag = ({ children, color, bgColor, variant, closable, onClose }) => {

    const inlineStyle = {
        primary: {
            backgroundColor: "var(--primary)",
        },
        secondary: {
            borderColor: "var(--border)",
            color: "var(--text-sub)",
        },
        accent: {
            backgroundColor: "var(--accent)",
            color: "#fff",
        },
    };
	
	return (
        <Tag color={color} closable={closable} onClose={onClose} className="rounded-full w-fit max-h-fit px-3 py-0 text-xs flex items-center justify-center" style={inlineStyle[variant]}>
            {children}
        </Tag>
        
    );
};

export default CustomTag;