import {Component} from "react";
import React from 'react';
import { Link, Router } from "react-router-dom";
class TopBar extends Component {
    render() {
        return (
            <div>
                <div className="App">
                    <div className="Top-Bar">
                        <div className="Top-Bar-Element">
                            <div onClick={()=>window.location.href="/top"} className="Link">Top</div>
                        </div>
                        <div className="Top-Bar-Element">
                            <div onClick={()=>window.location.href="/newest"} className="Link">Newest</div>
                        </div>
                        <div className="Top-Bar-Element">
                            <div onClick={()=>window.location.href="/favorites"} className="Link">Favorites</div>
                        </div>
                        <div className="Top-Bar-Element">
                            <div onClick={()=>window.location.href="/settings"} className="Link">Settings</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default TopBar;