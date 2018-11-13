exports.TextColor = '#e7e7e7';
exports.DarkTextColor = '#7b8f8f';
exports.MainBGColor = '#1e1e1e';
exports.SecondaryBGColor = '#252526';
exports.TrimColor = '#414141';
exports.TabColor = '#383838';

exports.BGStyle = {
    backgroundColor: this.MainBGColor,
    color: this.TextColor
};

exports.DefaultStyle = {
    color: this.TextColor
};

exports.FormStyle = {
    color: this.TextColor,
    backgroundColor: this.SecondaryBGColor,
    borderRadius: "10px",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.5)",
    padding: "16px 50px",
    display: "inline-block"
};

exports.TextInputStyle = {
    backgroundColor: this.MainBGColor,
    color: this.TextColor,
    fontSize: "12pt",
    padding: "6px",
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "3px",
    border: "solid 1px " + this.TrimColor
};

exports.ButtonStyle = {
    backgroundColor: this.TabColor,
    color: this.TextColor,
    fontSize: "12pt",
    padding: "6px 12px",
    borderRadius: "3px",
    border: "solid 1px " + this.TrimColor
};
