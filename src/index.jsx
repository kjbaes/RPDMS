import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "antd/dist/antd.css";
import "./styles/index.css";
import { TranscationProvider } from "./Context/TransactionProvider";
import { UserProvider } from "./Context/UserProvider";
import { AuthProvider } from "./Context/auth";
import { ProductProvider } from "./Context/ProductProvider";
import { RiceVarietyProvider } from "./Context/RiceVarietyProvider";
import { FarmLocationProvider } from "./Context/FarmLocationProvider";
import { ProcurementProvider } from "./Context/ProcurementProvider";
import { DistributionProvider } from "./Context/DistributionProvider";
import { TargetProcurementProvider } from './Context/TargetProcurementProvider'

ReactDOM.render(
  <React.StrictMode>
    <TargetProcurementProvider>
      <DistributionProvider>
        <UserProvider>
          <ProcurementProvider>
            <FarmLocationProvider>
              <RiceVarietyProvider>
                <ProductProvider>
                  <AuthProvider>
                    <TranscationProvider>
                      <App />
                    </TranscationProvider>
                  </AuthProvider>
                </ProductProvider>
              </RiceVarietyProvider>
            </FarmLocationProvider>
          </ProcurementProvider>
        </UserProvider>
      </DistributionProvider>
    </TargetProcurementProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
