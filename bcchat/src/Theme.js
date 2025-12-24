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

exports.ListContainer = {
    minHeight: "100vh",
    backgroundColor: "#121212",
    color: "#e0e0e0",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
};

exports.List = {
    listStyle: "none",
    padding: 0,
    margin: 0,
    width: "100%",
    maxWidth: "400px"
}

exports.ListItem = {
    padding: "14px 18px",
    marginBottom: "12px",
    backgroundColor: "#1e1e1e",
    border: "1px solid #2a2a2a",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.15s ease, border 0.15s ease"
}

exports.SelectedListItem = {
    backgroundColor: "#2b3a55",
    border: "1px solid #4c6ef5"
}

exports.ItemHover = {
    backgroundColor: "#252525"
}

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

exports.ButtonSecondaryStyle = {
    marginTop: "24px",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#4c6ef5",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.15s ease"
}

exports.ButtonDisabledStyle = {
    backgroundColor: "#3a3a3a",
    cursor: "not-allowed"
}

exports.Error = {
    color: "#ff6b6b",
    marginTop: "16px"
}

exports.SubtleText = {
    color: "#a0a0a0",
    fontSize: "14px"
}
