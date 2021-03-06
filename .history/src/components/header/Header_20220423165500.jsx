import React from "react";
import { createMedia } from "@artsy/fresnel";
import { Icon, Image, Menu, Sidebar, Dropdown } from "semantic-ui-react";
import { Link, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Header.css";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { isUserExists, authoriseUser } from "../../services/api";


const AppMedia = createMedia({
  breakpoints: {
    mobile: 320,
    tablet: 768,
    computer: 992,
    largeScreen: 1200,
    widescreen: 1920,
  },
});
const { Media, MediaContextProvider } = AppMedia;

const NavBarMobile = (props) => {
  const { children, leftItems, onPusherClick, onToggle, rightItems, visible } =
    props;

  return (
    <Sidebar.Pushable>
      <Sidebar.Pusher id = "left-pusher" dimmed={visible} onClick={onPusherClick}>
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        items={leftItems}
        inverted
        vertical
        visible={visible}
        key={nanoid()}
      />
      </Sidebar.Pusher>
      
      <Sidebar.Pusher >
        <Menu fixed="top" inverted>
          <Menu.Item key={nanoid()}>
            <Image size="mini" src="./img" />
          </Menu.Item>
          <Menu.Item onClick={onToggle} key={nanoid()}>
            <Icon name="sidebar" />
          </Menu.Item>

          <Menu.Menu position="right" key="rightItems">
            {rightItems.map((item, index) => {
              if (item.children) {
                return (
                  <Menu.Item key={`rightParams${index}`}>
                    {item.children}
                  </Menu.Item>
                );
              }
              return <Menu.Item key={index} {...item.link} />;
            })}
          </Menu.Menu>
        </Menu>
        {children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

const NavBarDesktop = (props) => {
  const { leftItems, rightItems } = props;

  return (
    <Menu fixed="top" inverted>
      <Menu.Item key={nanoid()}>
        <Image size="0.2px" src="https://img.freepik.com/free-vector/guitar-shop-rock-roll_124137-1295.jpg?w=2000"/>
      </Menu.Item>

      {leftItems.map((item, index) => (
        <Menu.Item {...item} key={index} />
      ))}

      <Menu.Menu position="right" key="rightItems">
        {rightItems.map((item, index) => {
          if (item.children) {
            return (
              <Menu.Item key={`rightParams${index}`}>{item.children}</Menu.Item>
            );
          }
          return <Menu.Item key={index} {...item.link} />;
        })}
      </Menu.Menu>
    </Menu>
  );
};

// class NavBar extends React.Component {
//   state = {
//     visible: false,
//   };

//   handlePusher = () => {
//     const { visible } = this.state;

//     if (visible) this.setState({ visible: false });
//   };

//   handleToggle = () => this.setState({ visible: !this.state.visible });

//   render() {
//     const { leftItems, rightItems } = this.props;
//     const { visible } = this.state;

//     return (
//       <div className="customHeader">
//         <Media at="mobile">
//           <NavBarMobile
//             leftItems={leftItems}
//             onPusherClick={this.handlePusher}
//             onToggle={this.handleToggle}
//             rightItems={rightItems}
//             visible={visible}
//           ></NavBarMobile>
//         </Media>

//         <Media greaterThan="mobile">
//           <NavBarDesktop leftItems={leftItems} rightItems={rightItems} />
//         </Media>
//       </div>
//     );
//   }
// }
function NavBar({ leftItems, rightItems }) {
  const [visible, setVisible] = useState(false);

  const handlePusher = () => {
    if (visible) setVisible(false);
  };
  const handleToggle = () => setVisible(!visible);

  return (
    <div className="customHeader">
      <Media at="mobile">
        <NavBarMobile
          leftItems={leftItems}
          onPusherClick={handlePusher}
          onToggle={handleToggle}
          rightItems={rightItems}
          visible={visible}
        ></NavBarMobile>
      </Media>

      <Media greaterThan="mobile">
        <NavBarDesktop leftItems={leftItems} rightItems={rightItems} />
      </Media>
    </div>
  );
}
const leftItems = [
  { as: Link, to: "/", content: "Home", key: "home" },
  { as: Link, to: "/products", content: "Products", key: "products" },
 
];

const rightItems = [{ as: Link, to: "/login", content: "Login", key: "login" }];

function Header() {
  const {
    user,
    isAuthenticated,
    logout,
    error,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  rightItems.length = 0;
  if (isAuthenticated) {
    rightItems.push({
      children: [
        <Image avatar spaced="right" src={user.picture} key={nanoid()} />,
        <Dropdown pointing="top left" text={user.name} key="userDropdown">
          <Dropdown.Menu key="userDropdownMenu" id="drop-down">
            <Dropdown.Item text={user.name} key={user.name} />
            <Dropdown.Item
              as={Link}
              to="/dashboard"
              text="Dashboard"
              key="userDashboard"
            />
            <Dropdown.Item
              onClick={logout}
              text="Sign out"
              icon="power"
              key="userSignout"
            />
          </Dropdown.Menu>
        </Dropdown>,
      ],
    });
  } else {
    rightItems.push({
      link: { as: Link, to: "/login", content: "Login", key: "login" },
    });
  }
  useEffect(() => {
    (async () => {
      
      if (
        isAuthenticated &&
        localStorage.getItem("autoriseUser") !== user.nickname
      ) {
        let authorised;
        const isExist = await isUserExists(user.sub);
        console.log("isExists", isExist);
        if (!isExist || (isExist.httpStatus === "OK" && isExist.info.exists === 'false')) {
          const token = await getAccessTokenSilently();
          authorised = await authoriseUser(user, token);
        }
        if (
          (authorised && authorised.httpStatus === "OK") ||
          isExist.info.exists === 'true'
        ) {
          localStorage.setItem("autoriseUser", user.nickname);
        }
      }
    })();
  }, [isAuthenticated]);
  return (
    <MediaContextProvider>
      <NavBar leftItems={leftItems} rightItems={rightItems}>
        <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
      </NavBar>
    </MediaContextProvider>
  );
}

export default Header;
