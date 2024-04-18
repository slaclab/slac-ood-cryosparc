
# Remove any preconfigured monitors
if [[ -f "${HOME}/.config/monitors.xml" ]]; then
  mv "${HOME}/.config/monitors.xml" "${HOME}/.config/monitors.xml.bak"
fi

# Copy over default panel if doesn't exist, otherwise it will prompt the user
PANEL_CONFIG="${HOME}/.config/xfce4/xfconf/xfce-perchannel-xml/xfce4-panel.xml"
if [[ ! -e "${PANEL_CONFIG}" ]]; then
  mkdir -p "$(dirname "${PANEL_CONFIG}")"
  echo -en >"${PANEL_CONFIG}" <EOF
<?xml version="1.0" encoding="UTF-8"?>\n\n
<channel name="xfce4-panel" version="1.0">\n
  <property name="configver" type="int" value="2"/>\n
  <property name="panels" type="array">\n
    <value type="int" value="1"/>\n
    <value type="int" value="2"/>\n
    <property name="dark-mode" type="bool" value="true"/>\n
    <property name="panel-1" type="empty">\n
      <property name="position" type="string" value="p=6;x=0;y=0"/>\n
      <property name="length" type="uint" value="100"/>\n
      <property name="position-locked" type="bool" value="true"/>\n
      <property name="icon-size" type="uint" value="16"/>\n
      <property name="size" type="uint" value="26"/>\n
      <property name="plugin-ids" type="array">\n
        <value type="int" value="1"/>\n
        <value type="int" value="2"/>\n
        <value type="int" value="3"/>\n
        <value type="int" value="4"/>\n
        <value type="int" value="5"/>\n
        <value type="int" value="6"/>\n
        <value type="int" value="7"/>\n
        <value type="int" value="8"/>\n
        <value type="int" value="9"/>\n
        <value type="int" value="10"/>\n
        <value type="int" value="11"/>\n
        <value type="int" value="12"/>\n
        <value type="int" value="13"/>\n
        <value type="int" value="14"/>\n
      </property>\n
    </property>\n
    <property name="panel-2" type="empty">\n
      <property name="autohide-behavior" type="uint" value="1"/>\n
      <property name="position" type="string" value="p=10;x=0;y=0"/>\n
      <property name="length" type="uint" value="1"/>\n
      <property name="position-locked" type="bool" value="true"/>\n
      <property name="size" type="uint" value="48"/>\n
      <property name="plugin-ids" type="array">\n
        <value type="int" value="15"/>\n
        <value type="int" value="16"/>\n
        <value type="int" value="17"/>\n
        <value type="int" value="18"/>\n
        <value type="int" value="19"/>\n
        <value type="int" value="20"/>\n
        <value type="int" value="21"/>\n
        <value type="int" value="22"/>\n
      </property>\n
    </property>\n
  </property>\n
  <property name="plugins" type="empty">\n
    <property name="plugin-1" type="string" value="applicationsmenu"/>\n
    <property name="plugin-2" type="string" value="tasklist">\n
      <property name="grouping" type="uint" value="1"/>\n
    </property>\n
    <property name="plugin-3" type="string" value="separator">\n
      <property name="expand" type="bool" value="true"/>\n
      <property name="style" type="uint" value="0"/>\n
    </property>\n
    <property name="plugin-4" type="string" value="pager"/>\n
    <property name="plugin-5" type="string" value="separator">\n
        <property name="style" type="uint" value="0"/>\n
    </property>\n
    <property name="plugin-6" type="string" value="systray">\n
        <property name="square-icons" type="bool" value="true"/>\n
    </property>\n
    <property name="plugin-8" type="string" value="pulseaudio">\n
      <property name="enable-keyboard-shortcuts" type="bool" value="true"/>\n
      <property name="show-notifications" type="bool" value="true"/>\n
    </property>\n
    <property name="plugin-9" type="string" value="power-manager-plugin"/>\n
    <property name="plugin-10" type="string" value="notification-plugin"/>\n
    <property name="plugin-11" type="string" value="separator">\n
      <property name="style" type="uint" value="0"/>\n
    </property>\n
    <property name="plugin-12" type="string" value="clock"/>\n
    <property name="plugin-13" type="string" value="separator">\n
      <property name="style" type="uint" value="0"/>\n
    </property>\n
    <property name="plugin-14" type="string" value="actions"/>\n
    <property name="plugin-15" type="string" value="showdesktop"/>\n
    <property name="plugin-16" type="string" value="separator"/>\n
    <property name="plugin-17" type="string" value="launcher">\n
      <property name="items" type="array">\n
        <value type="string" value="xfce4-terminal-emulator.desktop"/>\n
      </property>\n
    </property>\n
    <property name="plugin-18" type="string" value="launcher">\n
      <property name="items" type="array">\n
        <value type="string" value="xfce4-file-manager.desktop"/>\n
      </property>\n
    </property>\n
    <property name="plugin-19" type="string" value="launcher">\n
      <property name="items" type="array">\n
        <value type="string" value="xfce4-web-browser.desktop"/>\n
      </property>\n
    </property>\n
    <property name="plugin-20" type="string" value="launcher">\n
      <property name="items" type="array">\n
        <value type="string" value="xfce4-appfinder.desktop"/>\n
      </property>\n
    </property>\n
    <property name="plugin-21" type="string" value="separator"/>\n
    <property name="plugin-22" type="string" value="directorymenu"/>\n
  </property>\n
</channel>
EOF
fi

# Don't use the systemd user bus for the X session
if [ "$DBUS_SESSION_BUS_ADDRESS" = "unix:path=$XDG_RUNTIME_DIR/bus" ]; then
    unset DBUS_SESSION_BUS_ADDRESS
fi

# Disable startup services
xfconf-query -c xfce4-session -p /startup/ssh-agent/enabled -n -t bool -s false
xfconf-query -c xfce4-session -p /startup/gpg-agent/enabled -n -t bool -s false

# Disable useless services on autostart
AUTOSTART="${HOME}/.config/autostart"
rm -fr "${AUTOSTART}"    # clean up previous autostarts
mkdir -p "${AUTOSTART}"
for service in "pulseaudio" "rhsm-icon" "spice-vdagent" "tracker-extract" "tracker-miner-apps" "tracker-miner-user-guides" "xfce4-power-manager" "xfce-polkit"; do
  echo -e "[Desktop Entry]\nHidden=true" > "${AUTOSTART}/${service}.desktop"
done

# Run Xfce4 Terminal as login shell (sets proper TERM)
TERM_CONFIG="${HOME}/.config/xfce4/terminal/terminalrc"
if [[ ! -e "${TERM_CONFIG}" ]]; then
  mkdir -p "$(dirname "${TERM_CONFIG}")"
  sed 's/^ \{4\}//' > "${TERM_CONFIG}" << EOL
    [Configuration]
    CommandLoginShell=TRUE
EOL
else
  sed -i \
    '/^CommandLoginShell=/{h;s/=.*/=TRUE/};${x;/^$/{s//CommandLoginShell=TRUE/;H};x}' \
    "${TERM_CONFIG}"
fi

mkdir ${LSCRATCH}/Desktop
export XDG_DESKTOP_DIR="${LSCRATCH}/Desktop"
export XDG_DATA_HOME="${LSCRATCH}/Desktop"

echo "XDG_DESKTOP_DIR=${XDG_DESKTOP_DIR}"
# Start up xfce desktop (block until user logs out of desktop)
xfce4-session
